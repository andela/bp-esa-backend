export const totalOnboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (
        SELECT "automationId"
        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "nokoAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where "a"."type"='onboarding'
    and a."createdAt" BETWEEN ? and ?
    ;
`;

export const successOnboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "slackAutomation"
    group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "emailAutomation"
    group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "nokoAutomation"
    group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where 1=1

    and "a"."type"='onboarding'
    and s.status = 0
    and e.status = 0
    and f.status = 0
    and a."createdAt" BETWEEN ? and ?
    ;
`;
